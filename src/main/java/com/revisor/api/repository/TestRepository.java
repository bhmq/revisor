package com.revisor.api.repository;

import com.revisor.api.model.Test;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestRepository extends JpaRepository<Test, Long> {

    @Override
    @EntityGraph(attributePaths = "urls")
    List<Test> findAll();

    @EntityGraph(attributePaths = "urls")
    Optional<Test> findWithUrlsById(Long id);
}
