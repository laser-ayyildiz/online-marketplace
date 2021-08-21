package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.model.Statistic;
import com.example.onlinemarketplace.service.impl.StatisticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/statistic")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping
    public Statistic get(){
        return statisticService.get();
    }
}
