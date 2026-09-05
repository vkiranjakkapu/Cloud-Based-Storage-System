package com.cbss.storage.services.imp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cbss.storage.dto.AccessRecordDto;
import com.cbss.storage.dto.FileSharingResponseDto;
import com.cbss.storage.dto.ShareFileRequestDto;
import com.cbss.storage.dto.SharedFileResponseDto;
import com.cbss.storage.enums.ShareType;
import com.cbss.storage.enums.StorageExceptions;
import com.cbss.storage.exceptions.BusinessException;
import com.cbss.storage.models.MetaFile;
import com.cbss.storage.models.SharedFile;
import com.cbss.storage.models.User;
import com.cbss.storage.repositories.MetaFileRepository;
import com.cbss.storage.repositories.SharedFileRepository;
import com.cbss.storage.services.CurrentUserService;
import com.cbss.storage.services.ShareService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShareServiceImp implements ShareService {

	private final SharedFileRepository sharesRepository;
	private final MetaFileRepository fileRepository;
	private final CurrentUserService currentUser;
	private final IdentityServiceImp identityService;

	@Override
	public List<SharedFileResponseDto> getSharedFiles() {
		List<SharedFile> allShares = sharesRepository.findAllByTargetUserIdAndExpiryAfter(currentUser.userId(),
				LocalDateTime.now());
		Set<UUID> userIds = allShares.stream().map(SharedFile::getFile).map(MetaFile::getOwnerId)
				.collect(Collectors.toSet());
		Map<UUID, User> usersMap = identityService.getAllUsersByIds(userIds);
		return allShares.stream().map(share -> mapResponse(share, usersMap.get(share.getFile().getOwnerId())))
				.toList();
	}

	private SharedFileResponseDto mapResponse(SharedFile share, User user) {
		user.setId(null);
		user.setAddress(null);
		return SharedFileResponseDto.builder().id(share.getId())
				.file(share.getFile())
				.owner(user)
				.type(share.getType())
				.targetUserId(share.getTargetUserId())
				.expiry(share.getExpiry())
				.updatedAt(share.getUpdatedAt())
				.createdAt(share.getCreatedAt())
				.build();
	}

	@Override
	public List<SharedFile> getSharedFiles(UUID userId) {
		return sharesRepository.findAllByTargetUserIdAndExpiryAfter(userId, LocalDateTime.now());
	}

	@Override
	public List<AccessRecordDto> getSharedWithUsers(UUID fileId) {
		MetaFile file = fileRepository.findById(fileId).orElseThrow(
				() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
						"File with given Id not found."));
		Set<UUID> userIds = file.getShares().stream().map(SharedFile::getTargetUserId)
				.collect(Collectors.toSet());
		Map<UUID, User> userMap = identityService.getAllUsersByIds(userIds);
		// file.getShares().stream()
		// .filter(share -> share.getExpiry().isAfter(LocalDateTime.now()))
		// .collect(Collectors.toMap(
		// SharedFile::getTargetUserId,
		// share -> share,
		// BinaryOperator.maxBy(
		// Comparator.comparing(SharedFile::getCreatedAt))))
		// .entrySet().stream()
		// .map(entry ->
		// AccessRecordDto.builder().user(userMap.get(entry.getKey())).share(entry.getValue())
		// .build())
		// .toList();
		return file.getShares().stream()
				.filter(share -> share.getExpiry().isAfter(LocalDateTime.now()))
				.map(share -> AccessRecordDto.builder()
						.user(userMap.get(share.getTargetUserId()))
						.share(share)
						.build())
				.toList();
	}

	@Override
	public FileSharingResponseDto shareFileWithUserIds(ShareFileRequestDto request) {
		List<SharedFile> shares = new ArrayList<>();
		MetaFile file = fileRepository.findById(request.fileId())
				.orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
						"File with Given Id Not Found!"));

		FileSharingResponseDto response = new FileSharingResponseDto();

		request.users().forEach(user -> {
			List<SharedFile> prevShares = sharesRepository.findAllByTargetUserIdAndFileAndExpiryAfter(
					user.userId(),
					file,
					LocalDateTime.now());
			if (prevShares.size() == 0) {
				shares.add(SharedFile.builder().file(file).targetUserId(user.userId())
						.expiry(request.expiry())
						.type(ShareType.PRIVATE).build());
				response.getInfo().add("Shared with " + user.email());
			} else {
				SharedFile lastShare = prevShares.stream()
						.sorted(Comparator.comparing(SharedFile::getExpiry).reversed()).toList()
						.getFirst();
				lastShare.setExpiry(request.expiry());
				shares.add(lastShare);
				response.getInfo().add("Share extended for " + user.email());
			}
		});

		sharesRepository.saveAll(shares);

		response.setShares(shares);

		return response;
	}

	@Override
	public boolean removeShareAccess(UUID accessId) {
		SharedFile access = sharesRepository.findById(accessId)
				.orElseThrow(() -> new BusinessException(StorageExceptions.RESOURCE_NOT_FOUND,
						"ShareId invalid"));
		access.setExpiry(LocalDateTime.now());
		sharesRepository.save(access);

		return false;
	}

}
