package com.revisor.api.repository;

import com.revisor.api.model.TestUrl;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestUrlRepository extends JpaRepository<TestUrl, Long> {
}
