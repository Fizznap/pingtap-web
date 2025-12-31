
export const THANE_AREAS = [
    'Kasarvadavali',
    'Ghodbunder Road',
    'Majiwada',
    'Manpada',
    'Wagle Estate',
    'Khopat',
    'Naupada',
    'Other'
];

export type CoverageStatus = 'idle' | 'available' | 'limited' | 'unavailable';

export async function checkServiceAvailability(
    pincode: string,
    area: string
): Promise<CoverageStatus> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isThanePincode = pincode?.startsWith('400');

    if (!isThanePincode) {
        return 'unavailable';
    } else if (area === 'Wagle Estate' || area === 'Khopat') {
        return 'unavailable';
    } else if (area === 'Naupada') {
        return 'limited';
    } else {
        return 'available';
    }
}
