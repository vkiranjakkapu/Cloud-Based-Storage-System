# ADR-002: Database Schema Design for Cloud-Based Storage System

* **Status:** Accepted
* **Date:** 2026-08-31
* **Decision Type:** Data Architecture
* **Scope:** Cloud-Based Storage System
* **Database:** PostgreSQL

---

## 1. Context

The Cloud-Based Storage System requires a relational data model capable of representing file and folder organization, file ownership, file lifecycle, sharing, access control, group membership, and upload processing.

The database must support:

* Unique identification of files, folders, groups, and upload operations.
* Hierarchical folder organization.
* File and folder ownership.
* File metadata and storage location.
* Public/private file sharing with optional expiration.
* Group-based and user-based file access.
* Group membership with role-based participation.
* Soft deletion of files and folders.
* File versioning through latest-version tracking.
* Tracking of in-progress and completed file uploads.
* Efficient lookup and join operations as the amount of stored data grows.

PostgreSQL was selected as the relational database, with the schema designed around normalized entities, explicit relationships, database constraints, and targeted indexes.

---

## 2. Decision

We will use a **PostgreSQL relational database** with separate entities for files, folders, uploads, groups, group participants, file sharing, and file access.

The database design will use:

* UUID primary keys for major domain entities.
* `BIGINT` identity keys for internal relationship records.
* PostgreSQL `TIMESTAMPTZ` for temporal data.
* Database-level `CHECK` constraints for controlled status and type values.
* Foreign keys with explicitly defined delete behavior.
* Soft deletion for files and folders.
* Latest-version tracking for files.
* Targeted B-tree and partial indexes for frequently executed queries.

The core domain tables are:

```text
groups
file_uploads
folders
files
file_sharing
participants
file_accesses
```

---

## 3. Key Design Decisions

### 3.1 Use UUIDs for Domain Entity Identifiers

Major domain entities use UUID primary keys.

UUIDs are used for entities such as:

```text
groups
folders
files
file_uploads
file_sharing
```

UUIDs provide unique identifiers suitable for distributed application environments and avoid exposing sequential database identifiers for primary domain objects.

Internal relationship records such as participants and file accesses use `BIGINT` identity keys where appropriate.

---

### 3.2 Use PostgreSQL as the Relational Database

PostgreSQL was selected because the system requires:

* Relational integrity through foreign keys.
* Transactional guarantees.
* Flexible indexing capabilities.
* Partial indexes.
* Native timezone-aware timestamp support.
* Database-level constraints.

The schema makes use of PostgreSQL-specific capabilities including:

```text
UUID
TIMESTAMPTZ
IDENTITY columns
CHECK constraints
partial indexes
```

---

### 3.3 Model Folders as a Hierarchical Structure

Folders are modeled as first-class domain entities rather than representing folder paths only as strings.

A folder can reference another folder as its parent, creating a hierarchical structure:

```text
Root
├── Documents
│   ├── Personal
│   └── Work
└── Images
    ├── Photos
    └── Screenshots
```

This allows the application to represent parent-child folder relationships and build a navigable directory tree.

The folder hierarchy is maintained through a self-referencing relationship between a folder and its parent.

---

### 3.4 Separate Upload Processing from Persisted File Metadata

File uploads and persisted files are represented as separate concepts.

```text
file_uploads
      |
      | upload lifecycle
      v
    files
```

`file_uploads` represents the upload operation and its current processing state, while `files` represents the persisted metadata of the resulting file.

Upload status is explicitly constrained to:

```text
IN_PROGRESS
COMPLETED
```

This separation allows upload processing to have an independent lifecycle without coupling it directly to the persisted file metadata.

---

### 3.5 Use Soft Deletion for Files and Folders

Files and folders use soft deletion rather than relying exclusively on physical deletion.

Files contain:

```text
is_deleted
```

and folders also contain:

```text
is_deleted
```

The default state for these entities is an active, non-deleted state:

```text
is_deleted = false
```

This allows the application to distinguish between active and deleted files/folders while retaining their database records.

For files, soft deletion works together with version tracking:

```text
is_deleted
is_latest
```

This allows the system to distinguish between deleted files, historical versions, and the currently active version.

For folders, the `is_deleted` flag allows folder lifecycle state to be maintained independently of immediate physical deletion.

---

### 3.6 Track the Latest File Version Explicitly

Files contain:

```text
is_latest
```

in addition to `is_deleted`.

The system can therefore identify the current version of a file without having to determine it solely from timestamps.

The intended active/latest state is:

```text
is_deleted = false
is_latest = true
```

This also allows historical file records to remain available for version-management operations.

---

### 3.7 Separate File Sharing from File Access Control

File sharing and file access are modeled separately.

`file_sharing` represents the sharing configuration of a file, including:

```text
file_id
user_id
type
expiry
```

Sharing type is restricted to:

```text
PUBLIC
PRIVATE
```

`file_accesses` represents access relationships involving users and groups.

This separation distinguishes the concept of **sharing configuration** from **authorization/access relationships**.

---

### 3.8 Support User-Based and Group-Based File Access

The access model allows file access to be associated with either a user or a group.

Conceptually:

```text
file_accesses
     |
     +── user_id
     |
     +── group_id
```

Access records support the following types:

```text
OWNER
MEMBER
GROUP
```

This provides the foundation for both individual and group-based authorization.

---

### 3.9 Model Group Membership as a Separate Relationship

Group membership is represented through the `participants` table.

The logical relationship is:

```text
groups
   |
   +──< participants
             |
             └── member_id
```

Each participant has a role:

```text
OWNER
EDITOR
VIEWER
```

This allows membership-specific attributes to exist on the relationship itself rather than being embedded directly into the group entity.

---

### 3.10 Enforce Controlled Values at the Database Level

Finite business states and types are protected with PostgreSQL `CHECK` constraints.

Examples include:

```text
file_uploads.status
file_sharing.type
participants.member_type
file_accesses.type
```

This prevents invalid values from being persisted even if application-level validation is bypassed.

Database constraints therefore provide a second layer of protection for important domain rules.

---

### 3.11 Use Explicit Foreign-Key Delete Semantics

Foreign-key relationships use deliberate delete behavior.

Dependent records such as file-sharing and participant records use cascading deletion where the relationship should not survive the deletion of its parent.

For example:

```text
file_sharing.file_id
        ↓
files.id
        ON DELETE CASCADE
```

and:

```text
participants.group_id
        ↓
groups.id
        ON DELETE CASCADE
```

For group references in `file_accesses`, `ON DELETE SET NULL` is used so that the access record can remain while its group association is removed.

This minimizes orphaned relationship records while preserving data where appropriate.

---

### 3.12 Use Timezone-Aware Timestamps

Temporal fields use PostgreSQL `TIMESTAMPTZ`.

The schema records lifecycle information such as:

```text
created_at
updated_at
modified_date
expiry
```

Timezone-aware timestamps are appropriate for a cloud-based application where operations may occur across different geographic locations.

---

### 3.13 Add Indexes According to Access Patterns

Indexes are explicitly created for frequently used relationship and lookup columns.

These include indexes on:

```text
file_sharing.file_id
participants.group_id
file_accesses.file_id
file_accesses.group_id
participants.member_id
file_accesses.user_id
```

These indexes improve common operations such as:

* Finding sharing records for a file.
* Finding members of a group.
* Finding access records for a file.
* Finding access relationships associated with a group.
* Finding groups associated with a member.
* Finding files accessible by a user.

---

### 3.14 Use Partial Indexes for Frequently Filtered States

Partial indexes are used for records that are commonly queried according to lifecycle state.

For files:

```text
is_deleted = false
AND is_latest = true
```

This targets active latest file records.

For uploads:

```text
status = 'IN_PROGRESS'
```

This supports efficient identification of uploads that may require cleanup or processing.

Partial indexes reduce unnecessary index entries by indexing only the subset of records relevant to the associated operations.

---

## 4. Resulting Data Model

The logical structure of the database is:

```text
                         ┌──────────────┐
                         │    groups    │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ participants │
                         └──────────────┘


┌──────────────┐
│ file_uploads │
└──────────────┘
        │
        │ upload lifecycle
        ▼
┌──────────────────┐
│      files       │
│                  │
│ is_deleted       │
│ is_latest        │
└────────┬─────────┘
         │
    ┌────┼──────────────┐
    │    │              │
    ▼    ▼              ▼
┌────────────┐   ┌──────────────┐
│file_sharing│   │file_accesses │
└────────────┘   └───────┬──────┘
                         │
                    ┌────┴────┐
                    │         │
                    ▼         ▼
                  users     groups


┌──────────────────┐
│     folders      │
│                  │
│ parent → folder  │
│ is_deleted       │
└────────┬─────────┘
         │
         └── self-referencing hierarchy
```

---

## 5. Consequences

### Positive Consequences

* Clear separation of core domain concepts.
* Strong relational integrity.
* Hierarchical folder organization.
* Independent upload and file lifecycles.
* Soft deletion for both files and folders.
* File version tracking through `is_latest`.
* Support for user and group-based access.
* Role-based group participation.
* Database-level validation of controlled values.
* Explicit foreign-key deletion behavior.
* Efficient lookup through targeted indexes.
* Efficient filtered queries through partial indexes.
* UUID identifiers suitable for a distributed/cloud-oriented application.

### Negative Consequences

* The schema is more complex than a basic CRUD file-storage model.
* Soft deletion requires application queries to account for `is_deleted`.
* File version management requires application logic to maintain `is_latest`.
* Folder deletion semantics require careful handling of child folders/files.
* Maintaining separate sharing and access concepts requires coordination at the application layer.
* UUIDs require more storage than small integer identifiers.
* PostgreSQL-specific features reduce portability to other relational databases.
* Some authorization invariants remain dependent on application-level logic.

---

## 6. Alternatives Considered

### 6.1 Store Folder Paths Instead of a Folder Hierarchy

**Rejected.**

Representing folders purely as path strings would make hierarchical operations such as moving folders, finding descendants, and maintaining parent-child relationships more difficult.

A self-referencing folder model provides a more natural representation of the directory structure.

---

### 6.2 Hard Delete Files and Folders

**Rejected.**

The system requires lifecycle preservation and file versioning capabilities. Soft deletion allows records to remain available while representing their deleted state.

---

### 6.3 Combine Files and Folders Into a Single Entity

**Rejected.**

Files and folders have different lifecycle and behavioral characteristics. Keeping them as separate entities provides clearer domain boundaries.

---

### 6.4 Combine File Sharing and File Access

**Rejected.**

Sharing configuration and authorization relationships represent different concepts and contain different attributes.

Keeping them separate provides greater flexibility for future access-control requirements.

---

### 6.5 Store Group Members Directly in the Group

**Rejected.**

Group membership is a relationship with additional information, particularly the participant role. A dedicated `participants` table provides the appropriate relational model.

---

### 6.6 Rely Exclusively on Application-Level Validation

**Rejected.**

Important domain invariants should also be enforced at the database level to protect data integrity regardless of how the database is accessed.

---

## 7. Future Considerations

Potential future schema improvements include:

1. Adding uniqueness constraints to prevent duplicate group memberships or duplicate access relationships where required.
2. Adding database constraints to enforce valid combinations of `user_id`, `group_id`, and access type.
3. Adding folder-specific partial indexes if production query patterns frequently filter on `is_deleted`.
4. Introducing an explicit logical-file/version relationship if file versioning becomes more sophisticated.
5. Adding additional upload states such as `FAILED`, `CANCELLED`, or `EXPIRED` if required.
6. Expanding the permission model if more granular authorization becomes necessary.
7. Defining explicit database-level rules for folder deletion and descendant handling if soft-deleted folders need cascading lifecycle semantics.

These changes should be introduced through separate ADRs when they become significant architectural decisions.

---

## 8. Decision Summary

The Cloud-Based Storage System adopts a **PostgreSQL-based normalized relational schema** that separates:

* Folder hierarchy
* File metadata
* Upload processing
* File sharing
* File access
* Group membership
* File lifecycle

The design uses **UUIDs, relational constraints, soft deletion, version tracking, explicit foreign-key semantics, and targeted indexing** to provide a reliable foundation for a cloud-based file storage system.

The primary architectural priorities are:

**Domain clarity → Data integrity → Lifecycle management → Access-control flexibility → Query performance**
