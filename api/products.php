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
            while ($row = $stmt->fetch()) {
                // MySQL JSON / TEXT column is decoded back to a PHP object for JSON output
                $row['specs'] = json_decode($row['specs'], true);
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
            
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':id' => $input['id'],
                ':title' => $input['title'],
                ':category' => $input['category'],
                ':image' => $input['image'] ?? '',
                ':shortDesc' => $input['shortDesc'] ?? '',
                ':longDesc' => $input['longDesc'] ?? '',
                ':specs' => json_encode($input['specs'] ?? new stdClass()),
                ':sort_order' => $input['sort_order'] ?? 0
            ]);
            
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
