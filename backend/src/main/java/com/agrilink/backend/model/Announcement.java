package com.agrilink.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecipientGroup recipientGroup;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public RecipientGroup getRecipientGroup() { return recipientGroup; }
    public void setRecipientGroup(RecipientGroup recipientGroup) { this.recipientGroup = recipientGroup; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}// package com.agrilink.backend.model;

// import jakarta.persistence.*;
// import lombok.Getter;
// import lombok.Setter;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "announcements")
// @Getter
// @Setter
// public class Announcement {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "sender_id")
//     private User sender;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private RecipientGroup recipientGroup;

//     @Column(nullable = false, length = 1000)
//     private String message;

//     @Column(nullable = false)
//     private LocalDateTime createdAt = LocalDateTime.now();
// }
