# ADR-001: Combine File Storage and Access Management in Storage Service

* **Status:** Accepted
* **Date:** 2026-08-25

## Context

The Cloud-Based Storage System requires functionality for both managing stored files and controlling access to those files.

The Storage domain includes:

* File upload information and metadata
* File ownership
* User-to-file sharing relationships
* Group membership and group-based sharing
* File share links
* Access permissions

A design decision was required on whether these responsibilities should be implemented as separate microservices or maintained within a single Storage Service.

The system includes a dedicated **Identity Service** as an individual microservice alongside the Storage Service and other platform services. It is responsible for user identity verification and user management. Therefore, the Storage Service does not need to own user identity management.

## Decision

We will maintain **file management and file access management within the same Storage Service**.

The Storage Service will be responsible for:

* File metadata and upload information
* File ownership
* User and group relationships related to stored files
* File-sharing permissions
* Share links
* Authorization decisions for storage resources
* Interaction with the underlying cloud/object storage provider

The Identity Service remains responsible for authentication, identity verification, and user management.

Therefore, the responsibilities are separated as follows:

| Component            | Responsibility                             |
| -------------------- | ------------------------------------------ |
| Identity Service     | Who the user is                            |
| Storage Service      | What storage resources the user can access |
| Cloud/Object Storage | Physical storage of file objects           |

## Rationale

File management and access management are closely related within the storage domain.

Access decisions require information about the resource being accessed, its owner, sharing relationships, groups, and permissions. Keeping these responsibilities within the same service allows the authorization logic to remain close to the storage resources it protects.

Creating separate Upload and Access Management microservices at this stage would introduce additional service-to-service communication and operational complexity without providing a clear benefit.

The Storage Service can still maintain clear internal separation between file management and authorization logic without requiring them to become independently deployable services.

## Alternatives Considered

### 1. Separate Upload/Storage Service and Access Management Service

```text
Client
  │
  ▼
Storage Service ─────► Access Management Service
  │
  ▼
Cloud Storage
```

**Rejected.**

Although this provides stronger service-level separation, it would introduce additional network calls and operational complexity for a domain that is currently cohesive.

### 2. Combine Storage and Access Management

```text
Client
  │
  ▼
Storage Service
  ├── File Management
  ├── Access Management
  ├── Sharing
  └── Cloud Storage Integration
```

**Accepted.**

This provides a clear service boundary around the storage domain while avoiding unnecessary microservice decomposition.

### 3. Put Access Management in Identity Service

**Rejected.**

The Identity Service is responsible for identity and user management. File-specific authorization belongs to the Storage domain because it depends on storage resources, ownership, groups, and sharing relationships.

## Consequences

### Positive

* Simpler service architecture
* Fewer service-to-service calls
* Centralized storage-related authorization
* Easier consistency between file metadata and permissions
* Clear separation between identity management and resource authorization
* Easier development and deployment for the current system

### Negative

* Storage Service has a broader responsibility than simple file management
* The service may eventually become large as storage features grow
* Independent scaling of upload processing and authorization is not possible at the service level

## Future Consideration

If the storage platform grows significantly, access management may be extracted into a separate service if there is a concrete need for:

* Independent scaling
* Independent ownership
* Reuse of authorization across multiple resource services
* More complex permission policies
* Stronger security or compliance isolation

Until such requirements emerge, keeping both responsibilities within the Storage Service provides the appropriate level of separation for the system.
