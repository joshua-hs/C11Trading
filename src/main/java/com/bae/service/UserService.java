package com.bae.service;

import java.util.List;

import com.bae.domain.User;

public interface UserService {
	
	User createUser(User User);
	
	List<User> getUsers();
	
	User getUserById(Long id);
	
	boolean removeUser(Long id);
	
	double getAvailableCapital(Long id);
	
	User modifyAvailableCapital(Long id, User capitalAdjustment);
	
	User getUserByName(String name);
}
