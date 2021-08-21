package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.response.CategoryDto;
import com.example.onlinemarketplace.model.Category;
import com.example.onlinemarketplace.model.CategoryType;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAllCategories();

    Category createNewCategory(Category category);

    Category updateCategory(Category category);

    Boolean deleteCategory(Category category);

    boolean existsById(Long id);

    List<CategoryDto> getCategoryByBaseCategory(CategoryType categoryType);

    List<CategoryDto> getCategoryByNameLike(String name);
}
