const ZAMMAD_BASE_URL = 'https://helpdesk.icc.knu.ua';

const fingerprint = () => {
    try {
        if (typeof document === 'undefined') return '';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        const txt = 'https://zammad.com';
        ctx.textBaseline = 'top';
        ctx.font = "12px 'Arial'";
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = 'rgba(100, 200, 0, 0.7)';
        ctx.fillText(txt, 4, 17);
        return canvas.toDataURL();
    } catch (e) {
        return '';
    }
};

interface ZammadConfigResponse {
    token: string;
}

export const submitToZammad = async (data: {
    name: string;
    email: string;
    body: string;
    file?: File | null;
}) => {
    // 1. Get Config
    const fp = fingerprint();
    const configParams = new URLSearchParams();
    configParams.append('fingerprint', fp);
    
    // Check if we are in test mode or need other params? No, standard is enough.

    const configRes = await fetch(`${ZAMMAD_BASE_URL}/api/v1/form_config`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: configParams
    });

    if (!configRes.ok) {
        throw new Error('Failed to load Zammad config');
    }

    const config: ZammadConfigResponse = await configRes.json();

    // 2. Submit
    const formData = new FormData();
    formData.append('token', config.token);
    formData.append('fingerprint', fp);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('body', data.body);
    formData.append('title', 'Feedback Form'); 
    
    if (data.file) {
        formData.append('file[]', data.file);
    }

    const submitRes = await fetch(`${ZAMMAD_BASE_URL}/api/v1/form_submit`, {
        method: 'POST',
        body: formData
    });

    if (!submitRes.ok) {
        const errData = await submitRes.json().catch(() => ({}));
        // Zammad returns errors object sometimes
        if (errData.errors) {
             // Maybe join errors?
             const msg = Object.entries(errData.errors).map(([k, v]) => `${k}: ${v}`).join(', ');
             throw new Error(msg || 'Form submission failed');
        }
        throw new Error(errData.message || 'Failed to submit form');
    }

    return await submitRes.json();
};
