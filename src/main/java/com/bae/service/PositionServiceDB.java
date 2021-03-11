package com.bae.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.bae.domain.Position;
import com.bae.repos.PositionRepo;

@Service
public class PositionServiceDB implements PositionService {
	
	private PositionRepo repo;
	
	public PositionServiceDB(PositionRepo repo) {
		super();
		this.repo = repo;
	}

	@Override
	public Position createPosition(Position position) {
		Position saved = this.repo.save(position);
		return saved;
	}

	@Override
	public List<Position> getPositions() {
		return this.repo.findAll();
	}

	@Override
	public Position getPositionById(Long id) {
		Optional<Position> optPosition = this.repo.findById(id);
		return optPosition.get();
	}

	@Override
	public boolean removePosition(Long id) {
		this.repo.deleteById(id);
		return !this.repo.existsById(id);
	}

	@Override
	public Position increasePosition(Long id, Position newPosition) {
		Optional<Position> optPosition = this.repo.findById(id);
		Position existing = optPosition.get();
		
		existing.setUnitsHeld(existing.getUnitsHeld() + newPosition.getUnitsHeld());
		existing.setCost(existing.getCost() + newPosition.getCost());

		
		Position updated = this.repo.save(existing);
		
		return updated;
		
	}
	
	@Override
	public Position decreasePosition(Long id, Position newPosition) {
		Optional<Position> optPosition = this.repo.findById(id);
		Position existing = optPosition.get();
		
		existing.setUnitsHeld(existing.getUnitsHeld() - newPosition.getUnitsHeld());
		existing.setCost(existing.getCost() - newPosition.getCost());
		
		Position updated = this.repo.save(existing);
		
		return updated;
	}

	@Override
	public Position getPositionByName(String name) {
		return repo.findByName(name);
	}

}
