package com.cbss.reports.models;

import java.time.Instant;
import java.util.UUID;

import com.cbss.reports.enums.MemberType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupParticipant {

    private Long id;

    private Group group;

    private UUID memberId;

    @Builder.Default

    private MemberType memberType = MemberType.VIEWER;

    private Instant createdAt;

}
