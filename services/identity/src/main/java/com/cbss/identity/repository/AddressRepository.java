package com.cbss.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbss.identity.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
