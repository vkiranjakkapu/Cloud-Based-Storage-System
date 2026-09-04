package com.cbss.identity.config;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.cbss.identity.entities.Address;
import com.cbss.identity.entities.Role;
import com.cbss.identity.entities.RoleType;
import com.cbss.identity.entities.User;
import com.cbss.identity.repository.RoleRepository;
import com.cbss.identity.repository.UserRepository;
import com.cbss.identity.services.imp.StorageService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	private final StorageService storageService;

	@Override
	public void run(String... args) {

		Role adminRole = roleRepository.findByName(RoleType.ADMIN)
				.orElseGet(() -> roleRepository.save(
						new Role(null, RoleType.ADMIN, "Administrator")));

		roleRepository.findByName(RoleType.USER)
				.orElseGet(() -> roleRepository.save(
						new Role(null, RoleType.USER, "User")));

		if (userRepository.findByEmail("admin@cbss.com").isEmpty()) {

			Address address = Address.builder()
					.id(null)
					.pinCode("534237")
					.street("street-1")
					.state("AP")
					.country("India")
					.build();
			User admin = User.builder()
					.firstName("System")
					.lastName("Admin")
					.email("admin@cbss.com")
					.password(passwordEncoder.encode("admin123"))
					.address(address)
					.enabled(true)
					.createdAt(LocalDateTime.now())
					.updatedAt(LocalDateTime.now())
					.roles(Set.of(adminRole)).build();

			userRepository.save(admin);
			storageService.createRootDirectoryForUser(admin.getId(), admin.getEmail());
		}
	}

}