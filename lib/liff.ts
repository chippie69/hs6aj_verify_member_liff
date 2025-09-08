import liff from '@line/liff';

export async function initLiff(liffId: string) {
    if (!liffId) throw new Error("LIFF ID is missing");
    
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
        liff.login();
    }

    return await liff.getProfile();
}