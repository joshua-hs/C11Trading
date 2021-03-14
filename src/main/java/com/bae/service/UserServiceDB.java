package com.bae.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.bae.domain.User;
import com.bae.repos.UserRepo;

@Service
public class UserServiceDB implements UserService {

	private UserRepo repo;
	
	public UserServiceDB(UserRepo repo) {
		super();
		this.repo = repo;
	}
	
	
	@Override
	public User createUser(User user) {
		User saved = this.repo.save(user);
		return saved;
	}

	@Override
	public List<User> getUsers() {
		return this.repo.findAll();
	}

	@Override
	public User getUserById(Long id) {
		Optional<User> optUser = this.repo.findById(id);
		return optUser.get();
	}
	
	@Override
	public User getUserByName(String name) {
		return this.repo.findByName(name);
	}

	@Override
	public boolean removeUser(Long id) {
		this.repo.deleteById(id);
		return !this.repo.existsById(id);
	}
	
	@Override
	public double getAvailableCapital(Long id) {
		Optional<User> user = this.repo.findById(id);
		return user.get().getAvailableCapital();
	}

	@Override
	public User modifyAvailableCapital(Long id, User capitalAdjustment) {
		Optional<User> optUser = this.repo.findById(id);
		User existing = optUser.get();
		
		existing.setAvailableCapital(existing.getAvailableCapital() + capitalAdjustment.getAvailableCapital());
		
		User updated = this.repo.save(existing);
		
		return updated;
	}


}
