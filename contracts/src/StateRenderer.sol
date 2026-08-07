// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IStateRenderer} from "./interfaces.sol";

/// @title StateRenderer — deterministic onchain metadata for State Zero
/// @notice PROTOTYPE. Renders the artifact as an open-boundary state cell
/// with one stratum per witnessed Chronicle event (bounded). Pure function
/// of (tokenId, seed, eventsWitnessed): same inputs, same image, forever.
contract StateRenderer is IStateRenderer {
    using Strings for uint256;

    uint256 private constant MAX_STRATA = 48; // bounded rendering loop

    function tokenURI(uint256 tokenId, bytes32 seed, uint256 eventsWitnessed)
        external
        pure
        returns (string memory)
    {
        string memory svg = _svg(tokenId, seed, eventsWitnessed);
        string memory json = string.concat(
            '{"name":"STATE ZERO ',
            _serial(tokenId),
            '","description":"Founding artifact of NO END STATE. Company history accumulates; the frame never closes.",',
            '"attributes":[{"trait_type":"Events Witnessed","value":',
            eventsWitnessed.toString(),
            '}],"image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
        );
        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }

    function _serial(uint256 tokenId) private pure returns (string memory) {
        bytes memory b = bytes(tokenId.toString());
        while (b.length < 4) {
            b = abi.encodePacked("0", b);
        }
        return string(b);
    }

    function _svg(uint256 tokenId, bytes32 seed, uint256 eventsWitnessed)
        private
        pure
        returns (string memory)
    {
        uint256 rnd = uint256(keccak256(abi.encodePacked(seed, tokenId)));
        uint256 strata = eventsWitnessed > MAX_STRATA ? MAX_STRATA : eventsWitnessed;

        // Open gap position on the top edge, between 20% and 70% of width.
        uint256 gapStart = 96 + (rnd % 240); // x of gap start (480 wide, margin 48)
        uint256 gapEnd = gapStart + 34;

        bytes memory lines;
        uint256 r = rnd;
        for (uint256 i = 0; i < strata; ++i) {
            r = uint256(keccak256(abi.encodePacked(r)));
            uint256 y = 540 - ((i * 440) / (strata > 12 ? strata : 12));
            uint256 inset = r % 140;
            bool fromLeft = (r >> 8) % 2 == 0;
            uint256 x1 = fromLeft ? 60 : 60 + inset;
            uint256 x2 = fromLeft ? 420 - inset : 420;
            bool accent = (r >> 16) % 10 < 3;
            lines = abi.encodePacked(
                lines,
                '<line x1="', x1.toString(), '" y1="', y.toString(),
                '" x2="', x2.toString(), '" y2="', y.toString(),
                '" stroke="', accent ? "#59d9c3" : "#8a867c",
                '" stroke-width="1" opacity="0.8"/>'
            );
        }

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">',
                '<rect width="480" height="600" fill="#0e0d0b"/>',
                // left, bottom, right edges of the cell
                '<path d="M48 48 V552 H432 V48" stroke="#e8e4da" stroke-width="2" fill="none"/>',
                // broken top edge
                '<line x1="48" y1="48" x2="', gapStart.toString(), '" y2="48" stroke="#e8e4da" stroke-width="2"/>',
                '<line x1="', gapEnd.toString(), '" y1="48" x2="432" y2="48" stroke="#e8e4da" stroke-width="2"/>',
                // signal tick escaping the opening
                '<line x1="', (gapStart + 17).toString(), '" y1="48" x2="', (gapStart + 17).toString(),
                '" y2="20" stroke="#59d9c3" stroke-width="2"/>',
                lines,
                '<text x="48" y="580" font-family="monospace" font-size="14" fill="#8a867c" letter-spacing="2">SZ ',
                _serial(tokenId),
                "</text>",
                "</svg>"
            )
        );
    }
}
