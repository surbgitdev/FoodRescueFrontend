
package com.foodrescuett.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorIdOrderByIdDesc(Long donorId);

    List<Donation> findByStatusOrderByIdDesc(String status);

    List<Donation> findByNgoIdOrderByIdDesc(Long ngoId);

    List<Donation> findByVolunteerIdOrderByIdDesc(Long volunteerId);
}
