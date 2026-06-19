<?php
include_once 'db.php';

// Auto-migrate: Add sort_order column if not present
try {
    $checkColumn = $conn->query("SHOW COLUMNS FROM `products` LIKE 'sort_order'");
    if ($checkColumn->rowCount() == 0) {
        $conn->exec("ALTER TABLE `products` ADD `sort_order` INT NOT NULL DEFAULT 0");
    }
} catch (Exception $e) {
    // Fail silently if table products doesn't exist yet
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $query = "SELECT * FROM products ORDER BY sort_order ASC, id ASC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            
            $products = [];
            
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $script_dir = dirname($_SERVER['SCRIPT_NAME']);
            $script_dir = str_replace('\\', '/', $script_dir);
            $script_dir = rtrim($script_dir, '/');
            $base_url = $protocol . $host . $script_dir . '/';

            while ($row = $stmt->fetch()) {
                // MySQL JSON / TEXT column is decoded back to a PHP object for JSON output
                $row['specs'] = json_decode($row['specs'], true);

                // 1. Auto-migrate base64 image in database to physical file on first load!
                if (!empty($row['image']) && strpos($row['image'], 'data:image/') === 0) {
                    try {
                        if (!file_exists('uploads')) {
                            mkdir('uploads', 0755, true);
                        }
                        preg_match('/^data:image\/(\w+);base64,/', $row['image'], $type_match);
                        $ext = isset($type_match[1]) ? $type_match[1] : 'jpg';
                        if ($ext === 'jpeg') $ext = 'jpg';

                        $image_data = substr($row['image'], strpos($row['image'], ',') + 1);
                        $image_data = base64_decode($image_data);

                        if ($image_data !== false) {
                            $filename = 'prod_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $row['id']) . '_' . time() . '.' . $ext;
                            $filepath = 'uploads/' . $filename;
                            file_put_contents($filepath, $image_data);

                            // Store relative path in database
                            $db_path = $filepath;
                            $updateStmt = $conn->prepare("UPDATE products SET image = :image WHERE id = :id");
                            $updateStmt->execute([':image' => $db_path, ':id' => $row['id']]);

                            $row['image'] = $db_path;
                        }
                    } catch (Exception $ex) {
                        // Ignore migration error
                    }
                }

                // 2. If it is already an absolute URL (e.g. from previous run with localhost), clean/migrate it to relative path in database
                if (!empty($row['image']) && (strpos($row['image'], 'http://') === 0 || strpos($row['image'], 'https://') === 0)) {
                    $uploads_pos = strpos($row['image'], '/uploads/');
                    if ($uploads_pos !== false) {
                        $relative_path = substr($row['image'], $uploads_pos + 1);
                        try {
                            $updateStmt = $conn->prepare("UPDATE products SET image = :image WHERE id = :id");
                            $updateStmt->execute([':image' => $relative_path, ':id' => $row['id']]);
                            $row['image'] = $relative_path;
                        } catch (Exception $ex) {
                            // Ignore
                        }
                    }
                }

                // 3. Convert relative path to dynamic absolute URL for the JSON response
                if (!empty($row['image']) && strpos($row['image'], 'uploads/') === 0) {
                    $row['image'] = $base_url . $row['image'];
                }
                
                $products[] = $row;
            }
            
            http_response_code(200);
            echo json_encode($products);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to fetch products: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // Require admin authentication for modifying products
        check_admin_auth();
        
        // Read JSON input body
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!$input || empty($input['id']) || empty($input['title'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid product data provided"]);
            exit();
        }

        // Process image: if it is base64, save it to file
        if (!empty($input['image']) && strpos($input['image'], 'data:image/') === 0) {
            try {
                if (!file_exists('uploads')) {
                    mkdir('uploads', 0755, true);
                }
                preg_match('/^data:image\/(\w+);base64,/', $input['image'], $type_match);
                $ext = isset($type_match[1]) ? $type_match[1] : 'jpg';
                if ($ext === 'jpeg') $ext = 'jpg';

                $image_data = substr($input['image'], strpos($input['image'], ',') + 1);
                $image_data = base64_decode($image_data);

                if ($image_data !== false) {
                    $filename = 'prod_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $input['id']) . '_' . time() . '.' . $ext;
                    $filepath = 'uploads/' . $filename;
                    file_put_contents($filepath, $image_data);

                    // Save relative path in database
                    $input['image'] = $filepath;
                }
            } catch (Exception $ex) {
                // Ignore upload image processing error
            }
        } elseif (!empty($input['image']) && (strpos($input['image'], 'http://') === 0 || strpos($input['image'], 'https://') === 0)) {
            // Clean absolute URL to relative path for database storage
            $uploads_pos = strpos($input['image'], '/uploads/');
            if ($uploads_pos !== false) {
                $input['image'] = substr($input['image'], $uploads_pos + 1);
            }
        }
        
        try {
            // Check if product exists to decide insert vs update
            $checkQuery = "SELECT id FROM products WHERE id = :id";
            $checkStmt = $conn->prepare($checkQuery);
            $checkStmt->execute([':id' => $input['id']]);
            $exists = $checkStmt->fetch();
            
            if ($exists) {
                // Update
                $query = "UPDATE products SET 
                            title = :title, 
                            category = :category, 
                            image = :image, 
                            shortDesc = :shortDesc, 
                            longDesc = :longDesc, 
                            specs = :specs,
                            sort_order = :sort_order 
                          WHERE id = :id";
            } else {
                // Insert
                $query = "INSERT INTO products (id, title, category, image, shortDesc, longDesc, specs, sort_order) 
                          VALUES (:id, :title, :category, :image, :shortDesc, :longDesc, :specs, :sort_order)";
            }
            
            $db_image_path = $input['image'] ?? '';

            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':id' => $input['id'],
                ':title' => $input['title'],
                ':category' => $input['category'],
                ':image' => $db_image_path,
                ':shortDesc' => $input['shortDesc'] ?? '',
                ':longDesc' => $input['longDesc'] ?? '',
                ':specs' => json_encode($input['specs'] ?? new stdClass()),
                ':sort_order' => $input['sort_order'] ?? 0
            ]);
            
            // Build response absolute URL dynamically
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $host = $_SERVER['HTTP_HOST'];
            $script_dir = dirname($_SERVER['SCRIPT_NAME']);
            $script_dir = str_replace('\\', '/', $script_dir);
            $script_dir = rtrim($script_dir, '/');
            $base_url = $protocol . $host . $script_dir . '/';

            if (!empty($input['image']) && strpos($input['image'], 'uploads/') === 0) {
                $input['image'] = $base_url . $input['image'];
            }

            http_response_code(200);
            echo json_encode([
                "status" => "success", 
                "message" => "Product " . ($exists ? "updated" : "created") . " successfully",
                "product" => $input
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database operation failed: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Require admin authentication
        check_admin_auth();
        
        $input = json_decode(file_get_contents("php://input"), true);
        if ($input && isset($input['sequence']) && is_array($input['sequence'])) {
            try {
                $conn->beginTransaction();
                $stmt = $conn->prepare("UPDATE products SET sort_order = :sort_order WHERE id = :id");
                foreach ($input['sequence'] as $index => $id) {
                    $stmt->execute([
                        ':sort_order' => $index,
                        ':id' => $id
                    ]);
                }
                $conn->commit();
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Sequence updated successfully"]);
            } catch (PDOException $e) {
                $conn->rollBack();
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Failed to update sequence: " . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid sequence data provided"]);
        }
        break;

    case 'DELETE':
        // Require admin authentication to delete products
        check_admin_auth();
        
        // Retrieve ID from query parameters or request body
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $input['id'] ?? null;
        }
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Product ID is required for deletion"]);
            exit();
        }
        
        try {
            $query = "DELETE FROM products WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->execute([':id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Product deleted successfully", "id" => $id]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Product not found or already deleted"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database deletion failed: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "HTTP Method not allowed"]);
        break;
}
?>
