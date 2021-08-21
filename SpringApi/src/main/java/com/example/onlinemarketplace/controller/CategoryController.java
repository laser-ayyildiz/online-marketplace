package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.response.CategoryDto;
import com.example.onlinemarketplace.model.Category;
import com.example.onlinemarketplace.model.CategoryType;
import com.example.onlinemarketplace.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/category")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    public List<CategoryDto> get() {
        return categoryService.getAllCategories();
    }

    @GetMapping
    public List<CategoryDto> getByQuery(@RequestParam(required = false) String name,
                                        @RequestParam(required = false) CategoryType type) {
        if (name == null && type == null)
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "query can not be null");

        if (name != null) return categoryService.getCategoryByNameLike(name);
        else return categoryService.getCategoryByBaseCategory(type);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public Category create(@Valid @RequestBody Category category) {
        return categoryService.createNewCategory(category);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping
    public boolean delete(@Valid @RequestBody Category category) {
        return categoryService.deleteCategory(category);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping
    public Category update(@Valid @RequestBody Category category) {
        return categoryService.updateCategory(category);
    }
}
