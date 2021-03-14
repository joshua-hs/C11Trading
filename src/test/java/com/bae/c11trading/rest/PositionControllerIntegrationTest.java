package com.bae.c11trading.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

import com.bae.domain.Position;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Sql(scripts = { "classpath:position-schema.sql", 
		"classpath:position-data.sql" }, executionPhase = ExecutionPhase.BEFORE_TEST_METHOD)
@ActiveProfiles("test")
public class PositionControllerIntegrationTest {
	
	@Autowired
	private MockMvc mockMVC;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Test
	void testCreate() throws Exception {
		//create position
		Position newPosition = new Position("BTC", 10, 600000, 1);
		
		String newPositionAsJSON = this.mapper.writeValueAsString(newPosition);
		
		RequestBuilder mockRequest = post("/createPosition").contentType(MediaType.APPLICATION_JSON).content(newPositionAsJSON);
		
		Position savedPosition = new Position(2L, "BTC", 10, 600000, 1);
		
		String savedPositionAsJSON = this.mapper.writeValueAsString(savedPosition);
		
		ResultMatcher matchStatus = status().isCreated();
		
		ResultMatcher matchBody = content().json(savedPositionAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(matchStatus).andExpect(matchBody);
	}
	
	
	@Test
	void testRead() throws Exception {
		
		Position testPosition = new Position(1L, "BTC", 3, 180000, 1);
		List<Position> allPositions = List.of(testPosition);
		String testPositionAsJSON = this.mapper.writeValueAsString(allPositions);
		
		RequestBuilder mockRequest = get("/getPositions");
		
		ResultMatcher checkStatus = status().isOk();
		ResultMatcher checkBody = content().json(testPositionAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(checkStatus).andExpect(checkBody);
	}
	
	@Test
	void testUpdateIncrease() throws Exception {
		
		Position newPosition = new Position("BTC", 2, 120000, 1);
		
		String newPositionAsJSON = this.mapper.writeValueAsString(newPosition);
		
		RequestBuilder mockRequest = put("/increasePosition/1").contentType(MediaType.APPLICATION_JSON)
				.content(newPositionAsJSON);
		
		Position savedPosition = new Position(1L, "BTC", 5, 300000, 1);
		
		String savedPositionAsJSON = this.mapper.writeValueAsString(savedPosition);
		
		ResultMatcher matchStatus = status().isOk();
		
		ResultMatcher matchBody = content().json(savedPositionAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(matchStatus).andExpect(matchBody);
	}
	
	@Test
	void testUpdateDecrease() throws Exception {
		
		Position newPosition = new Position("BTC", 2, 120000, 1);
		
		String newPositionAsJSON = this.mapper.writeValueAsString(newPosition);
		
		RequestBuilder mockRequest = put("/decreasePosition/1").contentType(MediaType.APPLICATION_JSON)
				.content(newPositionAsJSON);
		
		Position savedPosition = new Position(1L, "BTC", 1, 60000, 1);
		
		String savedPositionAsJSON = this.mapper.writeValueAsString(savedPosition);
		
		ResultMatcher matchStatus = status().isOk();
		
		ResultMatcher matchBody = content().json(savedPositionAsJSON);
		
		this.mockMVC.perform(mockRequest).andExpect(matchStatus).andExpect(matchBody);
	}
	
	@Test
	void testDelete() throws Exception {
		
		RequestBuilder mockRequest = delete("/removePosition/1");
		
		ResultMatcher checkStatus = status().isOk();
		ResultMatcher checkBody = content().string(("true"));
		
		this.mockMVC.perform(mockRequest).andExpect(checkStatus).andExpect(checkBody);
	}

}
