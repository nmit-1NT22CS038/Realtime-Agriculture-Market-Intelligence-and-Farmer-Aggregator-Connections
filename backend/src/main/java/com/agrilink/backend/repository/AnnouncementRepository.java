package com.agrilink.backend.repository;

import com.agrilink.backend.model.Announcement;
import com.agrilink.backend.model.RecipientGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByRecipientGroupInOrderByCreatedAtDesc(Collection<RecipientGroup> groups);
}