package com.bae.service;

import java.util.List;

import com.bae.domain.Position;

public interface PositionService {
	
	Position createPosition(Position position);
	
	List<Position> getPositions();
	
	Position getPositionById(Long id);
	
	boolean removePosition(Long id);
	
	Position increasePosition(Long id, Position newPosition);
	
	Position decreasePosition(Long id, Position newPosition);
	
	Position getPositionByName(String name);
}
