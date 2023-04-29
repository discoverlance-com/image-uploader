<script>
    import uploadImage from '$lib/assets/image.svg'
</script>

<div class="bg-white rounded-xl w-[402px] h-[469px] px-8 py-[36px] space-y-6 shadow-default">
    <h1 class="font-[500] text-lg leading-[27px] text-center text-primary-gray-400">Upload Your Image</h1>

    <p class="text-[10px] font-[500] leading-[15px] text-primary-gray-300 text-center">File should be Jpeg, Png,...</p>

    <form name="image-uploads" method="POST" data-netlify="true" class="space-y-6">
        <div class="h-[218.9px] bg-primary-gray-50 rounded-xl border-secondary-blue-100 border border-dashed">
            <div class="flex items-center justify-center mt-9">
                <img src={uploadImage} alt="Upload File"  />
            </div>
            <p class="text-center text-primary-gray-100 text-xs leading-[18px] mt-9">Dray & Drop your image here</p>
        </div>
    
        <p class="text-center text-primary-gray-100 text-xs leading-[18px]">Or</p>
    
        <div class="flex justify-center">
            <button type="button" class="bg-secondary-blue-200 cursor-pointer text-white h-8 w-[101px] rounded-lg text-[12px] flex items-center justify-center hover:bg-secondary-blue-200/90">
                <span>Choose a file</span>
            </button>
        </div>
    </form>
</div>