package com.bae.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bae.domain.User;
import com.bae.service.UserService;

@RestController
@CrossOrigin
public class UserController {
	
	private UserService service;
	
	public UserController(UserService service) {
		super();
		this.service = service;
	}
	
	@GetMapping("/getUsers")
	public ResponseEntity<List<User>> getUsers() {
		return ResponseEntity.ok(this.service.getUsers());
	}
	
	@GetMapping("/getAvailableCapital/{id}")
	public double getAvailableCapital(@PathVariable Long id) {
		return this.service.getAvailableCapital(id);
	}
	
	@PostMapping("/createUser")
	public ResponseEntity<User> createUser(@RequestBody User User) {
		return new ResponseEntity<User>(this.service.createUser(User), HttpStatus.CREATED);
	}
	
	
	@PutMapping("/modifyAvailableCapital/{id}")
	public User modifyAvailableCapital(@PathVariable Long id, @RequestBody User capitalAdjustment) {
		return this.service.modifyAvailableCapital(id, capitalAdjustment);
	}
	
	@DeleteMapping("/removeUser/{id}")
	public boolean removeUser(@PathVariable Long id) {
		return this.service.removeUser(id);
	}
	
}
