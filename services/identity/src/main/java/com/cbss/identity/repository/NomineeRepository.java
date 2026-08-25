package com.cbss.identity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbss.identity.entities.Nominee;
import com.cbss.identity.entities.User;

public interface NomineeRepository extends JpaRepository<Nominee, Long> {

    List<Nominee> findAllByCustomer(User customer);
    
}
