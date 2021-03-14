package com.bae.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bae.domain.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
	
		User findByName(String name);
}
