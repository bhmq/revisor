package com.revisor.api.service;

import com.revisor.api.dto.CreateTestRequest;
import com.revisor.api.dto.TestResponse;
import com.revisor.api.dto.TestUrlResponse;
import com.revisor.api.exception.NotFoundException;
import com.revisor.api.model.Test;
import com.revisor.api.model.TestUrl;
import com.revisor.api.repository.TestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TestService {

    private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @Transactional
    public TestResponse create(CreateTestRequest request) {
        Test test = new Test();
        test.setName(request.name());
        test.setDescription(request.description());
        request.urls().forEach(url -> {
            TestUrl testUrl = new TestUrl();
            testUrl.setUrl(url);
            test.addUrl(testUrl);
        });
        return toResponse(testRepository.save(test));
    }

    @Transactional(readOnly = true)
    public List<TestResponse> findAll() {
        return testRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TestResponse findById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional(readOnly = true)
    public Test findEntityById(Long id) {
        return testRepository.findWithUrlsById(id)
                .orElseThrow(() -> new NotFoundException("Test not found"));
    }

    private TestResponse toResponse(Test test) {
        List<TestUrlResponse> urls = test.getUrls().stream()
                .map(testUrl -> new TestUrlResponse(testUrl.getId(), testUrl.getUrl()))
                .toList();
        return new TestResponse(test.getId(), test.getName(), test.getDescription(), urls);
    }
}
