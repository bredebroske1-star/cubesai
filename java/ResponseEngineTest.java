import java.util.Scanner;

public class ResponseEngineTest {
    public static void main(String[] args) {
        ResponseEngine engine = new ResponseEngine();
        Scanner scanner = new Scanner(System.in);
        System.out.println("ArchAI Java test. Type 'exit' to quit.");
        while (true) {
            System.out.print("You: ");
            if (!scanner.hasNextLine()) break;
            String line = scanner.nextLine();
            if (line == null) break;
            if (line.equalsIgnoreCase("exit") || line.equalsIgnoreCase("quit")) {
                System.out.println("Goodbye.");
                break;
            }
            String resp = engine.getResponse(line);
            System.out.println("ArchAI: " + resp);
        }
        scanner.close();
    }
}
