package com.cbss.identity.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cbss.identity.entities.Role;
import com.cbss.identity.entities.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findAllByRoles(Set<Role> roles);

    boolean existsByEmail(String email);

    List<User> findByIdIn(Collection<UUID> ids);

    List<User> findAllByRolesAndDeletedFalse(Set<Role> roles);

    List<User> findAllByDeletedFalse();

    @Query("""
                SELECT u
                FROM User u
                WHERE LOWER(u.email) LIKE LOWER(CONCAT(:email, '%'))
                  AND u.deleted = false
            """)
    List<User> findAllByEmailStartingWithAndDeletedFalse(
            @Param("email") String email);

}