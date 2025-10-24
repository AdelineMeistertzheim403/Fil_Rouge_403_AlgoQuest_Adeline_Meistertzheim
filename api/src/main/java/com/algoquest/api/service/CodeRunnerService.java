package com.algoquest.api.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class CodeRunnerService {

    private static final String IMAGE = "registry.adelinemeistertzheim.fr/algoquest/sandbox:latest";
    private static final int TIMEOUT_SECONDS = 15;

    public String runJavaWithDocker(String codeSource, String input) {
        Path tempDir = null;
        try {
            // 1. Créer un répertoire temporaire
            final String uniqueId = UUID.randomUUID().toString();
            final Path sharedDir = Paths.get("/tmp/algoquest");
            Files.createDirectories(sharedDir);
            tempDir = Files.createTempDirectory(sharedDir, "code-" + uniqueId + "-");

            // 2. Écrire le code Java soumis
            final Path javaFile = tempDir.resolve("Main.java");
            Files.writeString(javaFile, codeSource);

            // 3. Construire la commande Docker
            final String dockerCmd = String.format(
                    "docker run --rm -i --network=none --memory=128m --cpus=1 " +
                            "--volumes-from algoquest-api -u root %s sh -c \"cd %s && javac Main.java && echo '%s' | java Main\"",
                    IMAGE,
                    tempDir.toAbsolutePath(),
                    input == null ? "" : input.replace("'", "'\\''"));

            System.out.println("🧱 CMD => " + dockerCmd);
            System.out.println("📁 Exists before run? " + Files.exists(tempDir));

            // 4. Lancer le process
            final Process process = Runtime.getRuntime().exec(new String[] { "sh", "-c", dockerCmd });
            final boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

            if (!finished) {
                process.destroyForcibly();
                return "Erreur: Temps d'exécution dépassé (" + TIMEOUT_SECONDS + "s)";
            }

            // 5. Lire la sortie
            @SuppressWarnings("resource")
            final String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));
            @SuppressWarnings("resource")
            final String errors = new BufferedReader(new InputStreamReader(process.getErrorStream()))
                    .lines().collect(Collectors.joining("\n"));

            final int exit = process.exitValue();

            if (exit != 0) {
                return "Erreur d'exécution/compilation:\n" + errors;
            }
            return output.isEmpty() ? "(Aucune sortie)" : output;

        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur système: " + e.getMessage();

        } finally {
            if (tempDir != null) {
                try {
                    System.out.println("🧹 Nettoyage " + tempDir);
                    Files.walk(tempDir)
                            .map(Path::toFile)
                            .sorted((a, b) -> -a.compareTo(b))
                            .forEach(java.io.File::delete);
                } catch (IOException ignored) {
                }
            }
        }
    }
}
