package com.algoquest.api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.io.*;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CodeRunnerServiceTest {

    private CodeRunnerService codeRunnerService;

    @BeforeEach
    void setup() {
        codeRunnerService = new CodeRunnerService();
    }

    //  Test 1 : Cas nominal — exécution correcte sans erreurs
    @Test
    void shouldReturnOutputWhenJavaRunsSuccessfully() throws Exception {
        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor(anyLong(), any(TimeUnit.class))).thenReturn(true);
        when(mockProcess.exitValue()).thenReturn(0);

        // Sortie simulée
        when(mockProcess.getInputStream()).thenReturn(new ByteArrayInputStream("Hello World".getBytes()));
        when(mockProcess.getErrorStream()).thenReturn(new ByteArrayInputStream(new byte[0]));

        try (MockedStatic<Runtime> runtimeMock = Mockito.mockStatic(Runtime.class)) {
            Runtime mockRuntime = mock(Runtime.class);
            runtimeMock.when(Runtime::getRuntime).thenReturn(mockRuntime);
            when(mockRuntime.exec(any(String[].class))).thenReturn(mockProcess);

            String result = codeRunnerService.runJavaWithDocker("System.out.println(\"Hello World\");", "input");

            assertEquals("Hello World", result);
            verify(mockRuntime, times(1)).exec(any(String[].class));
        }
    }

    //  Test 2 : Timeout (process ne se termine pas dans le temps imparti)
    @Test
    void shouldReturnTimeoutErrorWhenProcessExceedsLimit() throws Exception {
        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor(anyLong(), any(TimeUnit.class))).thenReturn(false); // simulate timeout

        try (MockedStatic<Runtime> runtimeMock = Mockito.mockStatic(Runtime.class)) {
            Runtime mockRuntime = mock(Runtime.class);
            runtimeMock.when(Runtime::getRuntime).thenReturn(mockRuntime);
            when(mockRuntime.exec(any(String[].class))).thenReturn(mockProcess);

            String result = codeRunnerService.runJavaWithDocker("System.out.println();", "");

            assertTrue(result.contains("Temps d'exécution dépassé"));
            verify(mockProcess).destroyForcibly();
        }
    }

    //  Test 3 : Erreur de compilation (exit code ≠ 0)
    @Test
    void shouldReturnCompilationErrorWhenExitCodeNonZero() throws Exception {
        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor(anyLong(), any(TimeUnit.class))).thenReturn(true);
        when(mockProcess.exitValue()).thenReturn(1);
        when(mockProcess.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(mockProcess.getErrorStream()).thenReturn(new ByteArrayInputStream("Compilation failed".getBytes()));

        try (MockedStatic<Runtime> runtimeMock = Mockito.mockStatic(Runtime.class)) {
            Runtime mockRuntime = mock(Runtime.class);
            runtimeMock.when(Runtime::getRuntime).thenReturn(mockRuntime);
            when(mockRuntime.exec(any(String[].class))).thenReturn(mockProcess);

            String result = codeRunnerService.runJavaWithDocker("invalid java", null);

            assertTrue(result.contains("Erreur d'exécution/compilation"));
            assertTrue(result.contains("Compilation failed"));
        }
    }

    //  Test 4 : Exception système (IOException, etc.)
    @Test
    void shouldReturnErrorMessageWhenExceptionThrown() throws Exception {
        try (MockedStatic<Runtime> runtimeMock = Mockito.mockStatic(Runtime.class)) {
            Runtime mockRuntime = mock(Runtime.class);
            runtimeMock.when(Runtime::getRuntime).thenReturn(mockRuntime);
            when(mockRuntime.exec(any(String[].class))).thenThrow(new IOException("Docker introuvable"));

            String result = codeRunnerService.runJavaWithDocker("System.out.println();", "");

            assertTrue(result.contains("Erreur système"));
            assertTrue(result.contains("Docker introuvable"));
        }
    }

    // Test 5 : Sortie vide
    @Test
    void shouldReturnPlaceholderWhenNoOutput() throws Exception {
        Process mockProcess = mock(Process.class);
        when(mockProcess.waitFor(anyLong(), any(TimeUnit.class))).thenReturn(true);
        when(mockProcess.exitValue()).thenReturn(0);
        when(mockProcess.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(mockProcess.getErrorStream()).thenReturn(new ByteArrayInputStream(new byte[0]));

        try (MockedStatic<Runtime> runtimeMock = Mockito.mockStatic(Runtime.class)) {
            Runtime mockRuntime = mock(Runtime.class);
            runtimeMock.when(Runtime::getRuntime).thenReturn(mockRuntime);
            when(mockRuntime.exec(any(String[].class))).thenReturn(mockProcess);

            String result = codeRunnerService.runJavaWithDocker("System.out.println();", "");

            assertEquals("(Aucune sortie)", result);
        }
    }
}
