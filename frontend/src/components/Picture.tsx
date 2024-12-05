import MyPicture from '../assets/pngegg.png';

const Picture = () => {
    return (
        <div className="lg:flex items-center  h-screen w-full">
            <img
                src={MyPicture}
                alt="Visual Representation"
                className="object-cover"
            />
        </div>
    );
};

export default Picture;