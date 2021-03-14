package com.bae.c11trading.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import com.bae.domain.Position;
import com.bae.repos.PositionRepo;
import com.bae.service.PositionServiceDB;

@SpringBootTest
@ActiveProfiles("test")
public class PositionServiceDBUnitTest {
	
	@Autowired
	private PositionServiceDB service;
	
	@MockBean
	private PositionRepo repo;
	
	@Test
	void testCreate() {
		Position newPosition = new Position("BTC", 1, 60000, 1);
		
		Position savedPosition = new Position(1L, "BTC", 1, 60000, 1);
		
		Mockito.when(this.repo.save(newPosition)).thenReturn(savedPosition);
		
		assertThat(this.service.createPosition(newPosition)).isEqualTo(savedPosition);
		
		Mockito.verify(this.repo, Mockito.times(1)).save(newPosition);
	}
	
	@Test
	void testRead() {
		Position examplePosition = new Position("BTC", 1, 60000, 1);
		List<Position> positionList = List.of(examplePosition);
		
		Mockito.when(this.service.getPositions()).thenReturn(positionList);
		
		assertThat(this.service.getPositions()).isEqualTo(positionList);
	}
	
	@Test
	void testUpdate() {
		Long id = 1L;
		
		Position newPosition = new Position("BTC", 1, 60000, 1);
		
		Optional<Position> optionalPosition = Optional.of(new Position(id, null, 0, 0, 0));
		
		Position updatedPosition = new Position(id, newPosition.getName(), newPosition.getUnitsHeld(), newPosition.getCost(), newPosition.getOwner());
		
		Mockito.when(this.repo.findById(id)).thenReturn(optionalPosition);
		
		Mockito.when(this.repo.save(updatedPosition)).thenReturn(updatedPosition);
		
		assertThat(this.service.increasePosition(id, newPosition)).isEqualTo(updatedPosition);
		
		Mockito.verify(this.repo, Mockito.times(1)).findById(id);
		Mockito.verify(this.repo, Mockito.times(1)).save(updatedPosition);
	}
	
	@Test
	void testDelete() {
		Long id = 1L;
		
		assertThat(this.service.removePosition(id)).isEqualTo(true);
		
		Mockito.verify(this.repo, Mockito.times(1)).existsById(id);
	}
	
	
}
