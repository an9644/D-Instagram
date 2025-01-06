// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Decentragram {
    uint public imageCount =0;

    struct Image{
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }
    //event  
    event ImageCreated(
        uint id,
        string hash,
        string description, 
        uint tipAmount,
        address payable author
    );
    event ImageTipped(
        uint id,
        string hash,
        string description, 
        uint tipAmount,
        address payable author
    );

    //storing images
    mapping(uint => Image) public images;

    //create Images
    function uploadImage(string memory _imgHash,string memory _description)public {

        require(bytes(_imgHash).length>0,"Image hash cannot be empty");
        require(bytes(_description).length>0,"Image description cannot be empty");
        require(msg.sender != address(0x0), "Sender address cannot be zero");

        //increment when image uploaded ++1
        imageCount ++; 

        //add image to contract
        images[imageCount] = Image(imageCount,_imgHash,_description,0,payable (msg.sender));

        //triggering the event
        emit ImageCreated(imageCount,_imgHash,_description,0,payable(msg.sender));

    }
    // View all images
    function viewImages() public view returns (Image[] memory) {
        Image[] memory allImages = new Image[](imageCount);
        for (uint256 i = 1; i <= imageCount; i++) {
            allImages[i - 1] = images[i];
        }
        return allImages;
    }
    //function to get address
    function getImageOwner(uint _id) public view returns (address payable) {
            require(_id > 0 && _id <= imageCount);
            return images[_id].author;
        }
    
    //tip image owner
    function tipImgOwner(uint _id)public payable {
        //making sure id is valid
        require(_id >0 && _id <= imageCount);

        //fetching image
        Image memory _image =images[_id];

        //fetching  the author
        address payable _author= _image.author;

        //paying author by sendeing ether
        _author.transfer(msg.value);

        //increment the tip amount
        _image.tipAmount=_image.tipAmount + msg.value;

        //update the image
        images[_id]= _image;

        //triggering the event
        emit ImageTipped(_id,_image.hash,_image.description,_image.tipAmount,_author);        

    }

}