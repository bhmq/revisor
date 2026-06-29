package com.revisor.api.service;

import com.revisor.api.dto.ResultResponse;
import com.revisor.api.dto.RunResponse;
import com.revisor.api.dto.RunStartResponse;
import com.revisor.api.exception.NotFoundException;
import com.revisor.api.model.Result;
import com.revisor.api.model.ResultStatus;
import com.revisor.api.model.Run;
import com.revisor.api.model.RunStatus;
import com.revisor.api.model.Test;
import com.revisor.api.repository.RunRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class RunService {

    private final TestService testService;
    private final RunRepository runRepository;
    private final UrlCheckService urlCheckService;

    public RunService(TestService testService, RunRepository runRepository, UrlCheckService urlCheckService) {
        this.testService = testService;
        this.runRepository = runRepository;
        this.urlCheckService = urlCheckService;
    }

    @Transactional
    public RunStartResponse start(Long testId) {
        Test test = testService.findEntityById(testId);
        Run run = new Run();
        run.setTest(test);
        run.setStatus(RunStatus.RUNNING);
        run.setStartedAt(Instant.now());
        runRepository.save(run);

        test.getUrls().forEach(testUrl -> run.addResult(urlCheckService.check(testUrl.getUrl())));

        run.setStatus(RunStatus.COMPLETED);
        run.setCompletedAt(Instant.now());
        return toStartResponse(runRepository.save(run));
    }

    @Transactional(readOnly = true)
    public RunResponse findById(Long id) {
        Run run = runRepository.findWithResultsById(id)
                .orElseThrow(() -> new NotFoundException("Run not found"));
        return toResponse(run);
    }

    private RunResponse toResponse(Run run) {
        List<ResultResponse> results = run.getResults().stream().map(this::toResponse).toList();
        int total = run.getTest().getUrls().size();
        int checked = results.size();
        return new RunResponse(
                run.getId(),
                run.getTest().getId(),
                run.getTest().getName(),
                status(run),
                total,
                checked,
                count(results, ResultStatus.OK),
                count(results, ResultStatus.HTTP_ERROR),
                count(results, ResultStatus.FAILED),
                progressPercent(total, checked),
                run.getStartedAt(),
                run.getCompletedAt(),
                results
        );
    }

    private RunStartResponse toStartResponse(Run run) {
        int total = run.getTest().getUrls().size();
        int checked = run.getResults().size();
        return new RunStartResponse(
                run.getId(),
                run.getTest().getId(),
                run.getTest().getName(),
                status(run),
                total,
                checked,
                progressPercent(total, checked)
        );
    }

    private ResultResponse toResponse(Result result) {
        return new ResultResponse(
                result.getUrl(),
                result.getStatus(),
                result.getHttpCode(),
                result.getErrorMessage(),
                result.getCheckedAt()
        );
    }

    private long count(List<ResultResponse> results, ResultStatus status) {
        return results.stream().filter(result -> result.status() == status).count();
    }

    private int progressPercent(int total, int checked) {
        return total == 0 ? 0 : checked * 100 / total;
    }

    private String status(Run run) {
        return run.getStatus() == RunStatus.COMPLETED ? "FINISHED" : run.getStatus().name();
    }
}
