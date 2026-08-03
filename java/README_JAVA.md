ArchAI Java demo

Instructions to run the local Java console demo:

Open a terminal and run:

```bash
cd ~/ArchAI/java
javac ResponseEngine.java ResponseEngineTest.java
java ResponseEngineTest
```

This runs a simple console chatbot port of the ArchAI logic.

Next steps:
- To build a native Android app in Java, open Android Studio and create a new project (Empty Activity) with Language: Java. Implement a chat UI (`RecyclerView`, `EditText`, `Button`) and call a `ResponseEngine` Java class similar to `ResponseEngine.java` above.
- To make a web version, port the response logic to JavaScript and build a static site (HTML/CSS/JS). Use an Arch-style theme but do NOT copy the Arch logo exactly; create a distinct logo or get permission.

Trademark/copyright notes:
- The Arch Linux wordmark and logo are trademarks. Do not use their exact logo without permission. Create an original `ArchAI` logo or use a generic icon.
- Add "Made by Brede" in the footer to credit yourself.

If you want, I can scaffold the Android project or create the web frontend next.
