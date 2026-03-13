package com.agrilink.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiresAt);
}
}

// package com.agrilink.backend.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "user_sessions")
// @Getter
// @Setter
// public class UserSession {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false, unique = true)
//     private String token;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "user_id")
//     private User user;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();

//     @Column(nullable = false)
//     private LocalDateTime expiresAt;
//       @PrePersist
//     protected void onCreate() {
//         if (createdAt == null) {
//             createdAt = LocalDateTime.now();
//         }
//     }
// }
