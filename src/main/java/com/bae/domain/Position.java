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
	
	private long owner;
	

	public Position(long id, String name, double unitsHeld, double cost, long owner) {
		super();
		this.id = id;
		this.name = name;
		this.unitsHeld = unitsHeld;
		this.cost = cost;
		this.owner = owner;
	}
	
	public Position(String name, double unitsHeld, double cost, long owner) {
		super();
		this.name = name;
		this.unitsHeld = unitsHeld;
		this.cost = cost;
		this.owner = owner;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
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

	public long getOwner() {
		return owner;
	}

	public void setOwner(long owner) {
		this.owner = owner;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		long temp;
		temp = Double.doubleToLongBits(cost);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + (int) (owner ^ (owner >>> 32));
		temp = Double.doubleToLongBits(unitsHeld);
		result = prime * result + (int) (temp ^ (temp >>> 32));
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Position other = (Position) obj;
		if (Double.doubleToLongBits(cost) != Double.doubleToLongBits(other.cost))
			return false;
		if (id != other.id)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (owner != other.owner)
			return false;
		if (Double.doubleToLongBits(unitsHeld) != Double.doubleToLongBits(other.unitsHeld))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Position [id=" + id + ", name=" + name + ", unitsHeld=" + unitsHeld + ", cost=" + cost + ", owner="
				+ owner + "]";
	}
	
	
}
