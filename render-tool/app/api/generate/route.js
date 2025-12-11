// app/api/generate/route.js
import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request) {
    try {
        const { prompt, materials, image, userApiKey } = await request.json();

        // 1. Get API Key (Env or User provided)
        const token = process.env.REPLICATE_API_TOKEN || userApiKey;
        if (!token) {
            return NextResponse.json({
                success: false,
                error: "Missing API Key. Please add it to .env.local or provide it in the settings."
            }, { status: 401 });
        }

        const replicate = new Replicate({ auth: token });

        // 2. Construct the "Superprompt"
        let materialInstructions = "MATERIAL MAPPING:\n";
        Object.values(materials).forEach(m => {
            materialInstructions += `- (${m.previewColor} parts) = ${m.material} (${m.finish}). `;
        });

        const superPrompt = `
      High Quality Architectural Photography, Interior Design Render.
      Style: ${prompt}.
      ${materialInstructions}
      Important: Keep the exact geometry of the input image. Realistic lighting, 8k resolution.
    `.trim();

        console.log("--- GENERATING WITH REPLICATE ---");
        console.log("Prompt:", superPrompt);

        // 3. Call ControlNet (Canny Edge Detection for Structure)
        // Model: jagilley/controlnet-canny-sdxl
        const output = await replicate.run(
            "jagilley/controlnet-canny-sdxl:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
            {
                input: {
                    image: image, // Expecting Base64 Data URI
                    prompt: superPrompt,
                    negative_prompt: "low quality, distorted, bad perspective, extra lines, blurry, cartoon, sketch, drawing",
                    num_inference_steps: 30, // Higher = better quality
                    controlnet_conditioning_scale: 0.7 // Strength of geometry preservation (0.0 to 1.0)
                }
            }
        );

        console.log("Success:", output);

        // Replicate returns an array of URLs. We usually want the first one.
        const resultUrl = Array.isArray(output) ? output[0] : output;

        return NextResponse.json({
            success: true,
            resultUrl: resultUrl
        });

    } catch (error) {
        console.error("Replicate Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
