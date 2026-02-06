import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase environment variables are missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const deviceName = formData.get('deviceName') as string;

        if (!file || !deviceName) {
            return NextResponse.json({ error: 'Missing file or device name' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // Sort files in zip to ensure correct sequence
        const files = Object.keys(zip.files)
            .filter(name => !zip.files[name].dir && (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')))
            .sort();

        const folderName = deviceName.toLowerCase().replace(/\s+/g, '-');
        const storagePath = `sequences/${folderName}/`;
        let frameCount = 0;

        // Upload each file to Supabase Storage
        const uploadPromises = files.map(async (name, index) => {
            const fileData = await zip.files[name].async('nodebuffer');
            const frameIndex = (index + 1).toString().padStart(3, '0');
            const fileName = `frame-${frameIndex}.jpg`; // Normalize to jpg for simplicity or keep original ext
            const fullPath = `${storagePath}${fileName}`;

            const { error } = await supabase.storage
                .from('documents')
                .upload(fullPath, fileData, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (error) throw error;
            frameCount++;
        });

        await Promise.all(uploadPromises);

        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(`${storagePath}frame-`);

        return NextResponse.json({
            success: true,
            sequencePath: publicUrl,
            frameCount: files.length
        });

    } catch (error: unknown) {
        console.error('Upload error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
