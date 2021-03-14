package com.bae.c11trading.rest;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultMatcher;

import com.bae.domain.User;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT) // loads the context
@AutoConfigureMockMvc
@Sql(scripts = { "classpath:user-schema.sql",
		"classpath:user-data.sql" }, executionPhase = ExecutionPhase.BEFORE_TEST_METHOD)
@ActiveProfiles("test")
public class UserControllerIntegrationTest {

	@Autowired
	private MockMvc mockMVC;

	@Autowired
	private ObjectMapper mapper;
	
	@Test
	void testCreate() throws Exception {
		// create user
		User newUser = new User("Bobby", 1000000);
		
		String newUserAsJSON = this.mapper.writeValueAsString(newUser);
		
		RequestBuilder mockRequest = post("/createUser").contentType(MediaType.APPLICATION_JSON)
				.content(newUserAsJSON);
		
		User savedUser = new User(2L, "Bobby", 1000000);
		
		String savedUserAsJSON = this.mapper.writeValueAsString(savedUser);
		
		ResultMatcher matchStatus = status().isCreated();
		ResultMatcher matchBody = content().json(savedUserAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(matchStatus).andExpect(matchBody);
		
	}
	
	@Test
	void testRead() throws Exception {
		
		User testUser = new User(1L, "Bobby", 1000000);
		List<User> allUsers = List.of(testUser);
		
		String testUserAsJSON = this.mapper.writeValueAsString(allUsers);
		
		RequestBuilder mockRequest = get("/getUsers");
		
		ResultMatcher checkStatus = status().isOk();
		ResultMatcher checkBody = content().json(testUserAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(checkStatus).andExpect(checkBody);
	}
	
	@Test
	void testUpdate() throws Exception {
		
		User capitalModification = new User("Bobby", 500000);
		
		String capitalModificationAsJSON = this.mapper.writeValueAsString(capitalModification);
		
		User expectedUser = new User(1L, "Bobby", 1500000);
		
		String expectedUserAsJSON = this.mapper.writeValueAsString(expectedUser);
		
		RequestBuilder mockRequest = put("/modifyAvailableCapital/1").contentType(MediaType.APPLICATION_JSON)
				.content(capitalModificationAsJSON);
		
		ResultMatcher checkStatus = status().isOk();
		ResultMatcher checkBody = content().json(expectedUserAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(checkStatus).andExpect(checkBody);
	}
	
	@Test
	void testDelete() throws Exception {
		
		RequestBuilder mockRequest = delete("/removeUser/1");
		
		ResultMatcher checkStatus = status().isOk();
		ResultMatcher checkBody = content().string("true");
		
		this.mockMVC.perform(mockRequest).andExpect(checkStatus).andExpect(checkBody);
	}
	
	
}
