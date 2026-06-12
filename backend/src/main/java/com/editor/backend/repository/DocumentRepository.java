package com.editor.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.editor.backend.entity.Document;
import com.editor.backend.entity.User;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUser(User user);
}
