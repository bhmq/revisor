package com.revisor.api.repository;

import com.revisor.api.model.Run;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RunRepository extends JpaRepository<Run, Long> {

    @EntityGraph(attributePaths = {"test", "results"})
    Optional<Run> findWithResultsById(Long id);
}
