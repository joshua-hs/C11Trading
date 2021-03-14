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

import com.bae.domain.User;
import com.bae.repos.UserRepo;
import com.bae.service.UserServiceDB;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceDBUnitTest {
	
	@Autowired
	private UserServiceDB service;
	
	@MockBean
	private UserRepo repo;
	
	@Test
	void testCreate() {
		User newUser = new User("Bobby", 1000000);
		User savedUser = new User(1L, "Bobby", 1000000);
		
		Mockito.when(this.repo.save(newUser)).thenReturn(savedUser);
		
		assertThat(this.service.createUser(newUser)).isEqualTo(savedUser);
		
		Mockito.verify(this.repo, Mockito.times(1)).save(newUser);
		
	}
	
	@Test
	void testRead() {
		User exampleUser = new User("Bobby", 1000000);
		List<User> userList = List.of(exampleUser);
		
		Mockito.when(this.service.getUsers()).thenReturn(userList);
		
		assertThat(this.service.getUsers()).isEqualTo(userList);
	}
	
	@Test
	void testUpdate() {
		Long id = 1L;
		
		User newUser = new User("Bobby", 1000000);
		
		Optional<User> optionalUser = Optional.of(new User(id, null, 0));
		
		User updatedUser = new User(id, newUser.getName(), newUser.getAvailableCapital());
		
		Mockito.when(this.repo.findById(id)).thenReturn(optionalUser);
		
		Mockito.when(this.repo.save(updatedUser)).thenReturn(updatedUser);
		
		assertThat(this.service.modifyAvailableCapital(id, newUser)).isEqualTo(updatedUser);
		
		Mockito.verify(this.repo, Mockito.times(1)).findById(id);
		Mockito.verify(this.repo, Mockito.times(1)).save(updatedUser);
	}
}
