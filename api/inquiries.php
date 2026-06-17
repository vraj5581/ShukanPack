<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Require admin authentication to view inquiries
        check_admin_auth();
        
        try {
            $query = "SELECT * FROM contact_messages ORDER BY date DESC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            
            $messages = [];
            while ($row = $stmt->fetch()) {
                // Ensure ID is an integer
                $row['id'] = (int)$row['id'];
                $messages[] = $row;
            }
            
            http_response_code(200);
            echo json_encode($messages);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to fetch messages: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // Anyone can submit a contact inquiry / quote request
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!$input || empty($input['name']) || empty($input['email'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Please fill in all required fields"]);
            exit();
        }
        
        try {
            $query = "INSERT INTO contact_messages (name, email, message, status, date) 
                      VALUES (:name, :email, :message, :status, :date)";
            
            $stmt = $conn->prepare($query);
            
            // Format ISO date or use current SQL time
            $date = $input['date'] ?? date('Y-m-d H:i:s');
            $status = $input['status'] ?? 'unread';
            $message = $input['message'] ?? '';
            
            $stmt->execute([
                ':name' => $input['name'],
                ':email' => $input['email'],
                ':message' => $message,
                ':status' => $status,
                ':date' => date('Y-m-d H:i:s', strtotime($date))
            ]);
            
            $newId = (int)$conn->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Inquiry submitted successfully",
                "id" => $newId
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database save failed: " . $e->getMessage()]);
        }
        break;

    case 'PATCH':
        // Require admin authentication to mark message as read
        check_admin_auth();
        
        $input = json_decode(file_get_contents("php://input"), true);
        $id = $input['id'] ?? null;
        $status = $input['status'] ?? 'read';
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Inquiry ID is required to update status"]);
            exit();
        }
        
        try {
            $query = "UPDATE contact_messages SET status = :status WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':status' => $status,
                ':id' => $id
            ]);
            
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Inquiry marked as " . $status, "id" => $id, "status_val" => $status]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update inquiry: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Require admin authentication to delete inquiries
        check_admin_auth();
        
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $input['id'] ?? null;
        }
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Inquiry ID is required for deletion"]);
            exit();
        }
        
        try {
            $query = "DELETE FROM contact_messages WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->execute([':id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Inquiry deleted successfully", "id" => $id]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Inquiry not found or already deleted"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete inquiry: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "HTTP Method not allowed"]);
        break;
}
?>
