package com.editor.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.editor.backend.entity.Document;
import com.editor.backend.entity.User;
import com.editor.backend.repository.DocumentRepository;
import com.editor.backend.repository.UserRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DocumentService(
            DocumentRepository documentRepository,
            UserRepository userRepository) {

        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(()
                        -> new RuntimeException("User not found"));
    }

    public Document createDocument(
            Document document,
            String email) {

        User user = getUserByEmail(email);

        document.setUser(user);

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments(String email) {

        User user = getUserByEmail(email);

        return documentRepository.findByUser(user);
    }

    public Document getDocumentById(
            Long id,
            String email) {

        User user = getUserByEmail(email);

        Document document = documentRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return document;
    }

    public Document updateDocument(
            Long id,
            Document updatedDocument,
            String email) {

        User user = getUserByEmail(email);

        Document document = documentRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        document.setTitle(updatedDocument.getTitle());
        document.setContent(updatedDocument.getContent());

        return documentRepository.save(document);
    }

    public void deleteDocument(
            Long id,
            String email) {

        User user = getUserByEmail(email);

        Document document = documentRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Document not found"));

        if (!document.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        documentRepository.delete(document);
    }
}
