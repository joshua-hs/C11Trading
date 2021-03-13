package com.bae.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Position {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String name;
	
	private double unitsHeld;
	
	private double cost;
	

	public Position(long id, String name, double unitsHeld, double cost) {
		super();
		this.id = id;
		this.name = name;
		this.unitsHeld = unitsHeld;
		this.cost = cost;
	}
	
	public Position(String name, double unitsHeld, double cost) {
		this.name = name;
		this.unitsHeld = unitsHeld;
		this.cost = cost;
	}
	
	public Position() {
		super();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getname() {
		return name;
	}

	public void setname(String name) {
		this.name = name;
	}

	public double getUnitsHeld() {
		return unitsHeld;
	}

	public void setUnitsHeld(double unitsHeld) {
		this.unitsHeld = unitsHeld;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}
	
	
}
