<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::user()->id;

        $products = Product::where('user_id', $user_id)->get()->map(function ($product) {
            $product->banner_image = $product->banner_image ? asset("storage/" . $product->banner_image) : null;
            return $product;
        });

        return response()->json([
            'status' => true,
            'message' => 'Products retrieved successfully',
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required'
        ]);

        $data['description'] = $request->description;
        $data['cost'] = $request->cost;

        $data['user_id'] = Auth::user()->id;

        if ($request->hasFile('banner_file')) {
            $data['banner_image'] = $request->file('banner_file')->store('products', 'public');
        }

        Product::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'status' => true,
            'message' => 'Product data',
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'required',
        ]);

        $data['description'] = isset($request->description) ? $request->description : $product->description;
        $data['cost'] = isset($request->cost) ? $request->cost : $product->cost;

        if ($request->hasFile('banner_file')) {
            if ($product->banner_image) {
                Storage::disk('public')->delete($product->banner_image);
            }

            $data['banner_image'] = $request->file('banner_file')->store('products', 'public');
        }

        $product->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->banner_image) {
            Storage::disk('public')->delete($product->banner_image);
        }
        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
