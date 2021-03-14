package com.bae.service;

import java.util.List;

import com.bae.domain.Position;

public interface PositionService {
	
	Position createPosition(Position position);
	
	List<Position> getPositions();
	
	Position getPositionById(Long id);
	
	Position getPositionByName(String name);
	
	boolean removePosition(Long id);
	
	Position increasePosition(Long id, Position newPosition);
	
	Position decreasePosition(Long id, Position newPosition);
	
	
}
