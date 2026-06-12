package com.editor.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.editor.backend.entity.Document;
import com.editor.backend.security.JwtUtil;
import com.editor.backend.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(
            DocumentService documentService) {

        this.documentService = documentService;
    }

    private String getEmailFromHeader(
            String authHeader) {

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            throw new RuntimeException("Token missing");
        }

        String token = authHeader.substring(7);

        return JwtUtil.extractEmail(token);
    }

    @PostMapping
    public Document createDocument(
            @RequestBody Document document,
            @RequestHeader("Authorization") String authHeader) {

        String email = getEmailFromHeader(authHeader);

        return documentService.createDocument(
                document,
                email);
    }

    @GetMapping
    public List<Document> getAllDocuments(
            @RequestHeader("Authorization") String authHeader) {

        String email = getEmailFromHeader(authHeader);

        return documentService.getAllDocuments(email);
    }

    @GetMapping("/{id}")
    public Document getDocumentById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        String email = getEmailFromHeader(authHeader);

        return documentService.getDocumentById(
                id,
                email);
    }

    @PutMapping("/{id}")
    public Document updateDocument(
            @PathVariable Long id,
            @RequestBody Document document,
            @RequestHeader("Authorization") String authHeader) {

        String email = getEmailFromHeader(authHeader);

        return documentService.updateDocument(
                id,
                document,
                email);
    }

    @DeleteMapping("/{id}")
    public String deleteDocument(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        String email = getEmailFromHeader(authHeader);

        documentService.deleteDocument(
                id,
                email);

        return "Document Deleted";
    }
}
