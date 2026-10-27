
package com.foodrescuett.backend;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationRepository donationRepository;

    public DonationController(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    // Get donations created by a specific donor
    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonorDonations(
            @PathVariable Long donorId) {
        return donationRepository.findByDonorIdOrderByIdDesc(donorId);
    }

    // Get all donations available for NGOs
    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatusOrderByIdDesc("Available");
    }

    // Get donations claimed by a specific NGO
    @GetMapping("/ngo/{ngoId}")
    public List<Donation> getNgoDonations(
            @PathVariable Long ngoId) {
        return donationRepository.findByNgoIdOrderByIdDesc(ngoId);
    }

    // Get delivery tasks available for volunteers
    @GetMapping("/delivery-tasks")
    public List<Donation> getDeliveryTasks() {
        return donationRepository.findByStatusOrderByIdDesc("Claimed")
                .stream()
                .filter(donation -> donation.getVolunteerId() == null)
                .toList();
    }

    // Get deliveries assigned to a specific volunteer
    @GetMapping("/volunteer/{volunteerId}")
    public List<Donation> getVolunteerDonations(
            @PathVariable Long volunteerId) {
        return donationRepository.findByVolunteerIdOrderByIdDesc(volunteerId);
    }

    // Create a new food donation
    @PostMapping
    public Donation createDonation(@RequestBody Donation donation) {
        donation.setStatus("Available");
        donation.setNgoId(null);
        donation.setVolunteerId(null);

        return donationRepository.save(donation);
    }

    // Allow an NGO to claim an available donation
    @PostMapping("/{donationId}/claim")
    @Transactional
    public Donation claimDonation(
            @PathVariable Long donationId,
            @RequestParam Long ngoId) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Donation not found"));

        if (!"Available".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This donation is no longer available");
        }

        donation.setNgoId(ngoId);
        donation.setStatus("Claimed");

        return donationRepository.save(donation);
    }

    // Allow a volunteer to accept a delivery task
    @PostMapping("/{donationId}/accept-delivery")
    @Transactional
    public Donation acceptDelivery(
            @PathVariable Long donationId,
            @RequestParam Long volunteerId) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Donation not found"));

        if (!"Claimed".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only claimed donations can be accepted for delivery");
        }

        if (donation.getVolunteerId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A volunteer has already accepted this delivery");
        }

        donation.setVolunteerId(volunteerId);
        donation.setStatus("Delivery Assigned");

        return donationRepository.save(donation);
    }

    // Mark an assigned delivery as completed
    @PostMapping("/{donationId}/mark-delivered")
    @Transactional
    public Donation markDelivered(
            @PathVariable Long donationId,
            @RequestParam Long volunteerId) {

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Donation not found"));

        if (!"Delivery Assigned".equals(donation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only assigned deliveries can be marked as delivered");
        }

        if (donation.getVolunteerId() == null
                || !donation.getVolunteerId().equals(volunteerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the assigned volunteer can complete this delivery");
        }

        donation.setStatus("Delivered");

        return donationRepository.save(donation);
    }
}
