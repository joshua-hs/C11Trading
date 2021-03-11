package com.bae.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bae.domain.Position;

@Repository
public interface PositionRepo extends JpaRepository<Position, Long> {
	
		Position findByName(String name);
}
